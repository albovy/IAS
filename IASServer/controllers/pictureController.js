const multer = require('multer');
const Picture = require('../models/Picture');
var path = require('path');
const fs =  require('fs');
const crypto = require('crypto');

const config = require('../config.json')

const { CastError } = require('mongoose/lib/error/cast');
const User = require('../models/User');
var upload = multer({
    limits: {
        file: 1,
        fileSize: config.maxUploadSize
    },
    storage: multer.memoryStorage({
        destination: './pictures',
        
        fileFilter: function(req, file, cb){

            



        },
        filename: function (req, file, cb) {

            var _fileName = `${req.user._id}_${Date.now().toString()}${path.extname(file.originalname)}`;    
            cb(null, _fileName);
        }
    })
    });

const algorithm = 'aes-256-cbc'; 

const encryptBuffer = (pictureBuffer) => {
    const cypher = crypto.createCipheriv(algorithm, Buffer.from(config.key, "hex"), Buffer.from(config.iv, "hex"));
    let encrypted = cypher.update(pictureBuffer);
    encrypted = Buffer.concat([encrypted, cypher.final()]); 
    return encrypted;
}

const decryptBuffer = (encryptedBuffer) => {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(config.key, "hex"), Buffer.from(config.iv, "hex"));
    const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
    return decrypted;
}



class PictureController{
    constructor(){}

    uploadPicture(req, res, next)  {

        upload.single('fichero')(req, res, function (err) {
            if (err) {
                console.log(err);
                if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE'){
                    return res.status(400).json({reason: "eres un pirulas"});
                } 
                return res.status(500).json({reason: "Internal Error"});
            }
            const fileName = req.file.originalname;

            const finalResolvedPath = path.join(path.resolve(__dirname, '../pictures'), fileName);

            console.log(req.file);


            const encryptedBuffer = encryptBuffer(req.file.buffer);
            fs.writeFileSync(finalResolvedPath, encryptedBuffer);

            var picture = new Picture();
            picture.owner_id = req.user._id;
            picture.uri = fileName;
            picture.save(null, (err, prod) => {
                if (err){
                    console.log(err);
                }
                else console.log("OK");
                return res.status(201).send();
            });

        });
    }

    async downloadPicture(req, res, next) {
        console.log('Download picture endpoint');
        const pictureUri = req.params.picture_id;
        try{
            const response = await Picture.findById(pictureUri);
            if (response == null)
                return res.status(404).json({reason: "Picture not found"});

            const resolvePicturePath = path.join(path.resolve(__dirname, '../pictures'), response.uri);

            if (!(req.user._id === response.owner_id || response.shared_with.includes(req.user._id)))
                return res.status(403).json({message: "Unauthorized"});

            if (!fs.existsSync(resolvePicturePath)){
                return res.status(404).json({reason: "Picture not found"});
            }

            const fileBuffered = fs.readFileSync(resolvePicturePath);
            const fileDecrypted = decryptBuffer(fileBuffered);

            const base64Decrypted = fileDecrypted.toString('base64');

            return res.json({filename: response.uri, rawdata: base64Decrypted});
        }
        catch (err){
            console.log(err);
            if (err instanceof CastError)
                return res.status(401).json({reason: "Invalid ID"});            
            return res.status(500).send();
        }
    }

    async deletePicture(req, res, next) {
        console.log('Delete picture endpoint');

        const picture_id = req.params.picture_id;
        try{
            const pictureToBeDeleted = await Picture.findOneAndDelete({owner_id: req.user._id, _id: picture_id});
            if (pictureToBeDeleted == null)
                return res.status(404).json({reason: "Picture not found or owner_id not corresponds to the owner"});

            console.log(pictureToBeDeleted);

            // Delete from drive
            const pathResolved = path.join(path.resolve(__dirname, '../pictures'), pictureToBeDeleted.uri);

            console.log(pathResolved);
            unlinkSync(pathResolved);
            
            return res.status(200).json({reason: "OK"});
            

        }
        catch (err){
            console.log(err);
            if (err instanceof CastError)
                return res.status(401).json({reason: "Invalid ID"});            
            return res.status(500).send();
        }
    }

    async sharePicture(req, res, next) {
        console.log('Share picture endpoint');
        const pictureId = req.body.picture_id;
        const userToSharedWithId = req.body.user_id;

        if (pictureId == null || userToSharedWithId == null)
            return res.status(403).json({reason: "Missing body parameters"});


        const findPicturePromise = Picture.findById(pictureId);
        const findUserPromise = User.findById(userToSharedWithId);

        try{
            const resultQueries = await Promise.all([findPicturePromise, findUserPromise]);
            if (resultQueries.includes(null))
                return res.status(403).json({reason: "Picture or user could not be found"});
            console.log(resultQueries);
            // Mirar que no sea el mismo usuario o ya este compartido

            if (resultQueries[0].owner_id === resultQueries[1]._id || resultQueries[0].shared_with.includes(resultQueries[1]._id))
                return res.status(403).json({reason: "Owner or already shared file"});

            // Añadir al array
            resultQueries[0].shared_with.push(userToSharedWithId);
            await resultQueries[0].save();

            return res.status(200).json({reason: "OK"});
        }
        catch (err){
            console.log(err);
            if (err instanceof CastError)
                return res.status(401).json({reason: "Invalid ID"});            
            return res.status(500).send();
        }
    }

    async getAllOwnedPictures (req, res, next) {
        // Endpoint para saber que fotografias tengo
        console.log('getAllOwnedPictures endpoint');
        console.log(`Requester user: ${req.user._id}`)
        const myPictures = await Picture.find({owner_id: req.user._id});

        return res.status(200).json(myPictures);
    }

    async unsharePicture(req, res, next) {
        console.log('Unshare endpoint');

        // Two scenarios: User is OWNER && wants to unshare to a specific user
        //                User is NOT owner && wants to unshare specific picture

        const affectedUserId = req.body.affected_user_id;
        const pictureId = req.body.picture_id;

        if (pictureId == null || affectedUser == null)
            return res.status(403).json({reason: "Missing necessary params affected_user & picture_id"});

        try{
            const pictureAffected = Picture.findById(pictureId);

            if (pictureAffected == null)
                return res.status(404).json({reason: "Picture not found"});

            if (pictureAffected.owner_id === req.user._id && affectedUser_id !== req.user._id){
                console.log('Owner wants to unshare file from another user');
                if (!pictureAffected.shared_with.includes(affectedUserId)){
                    console.log('It is not shared with this user');
                    return res.status(400).json({reason: "Not shared with this user"});
                }

                pictureAffected.shared_with = pictureAffected.shared_with.filter((value) => value !== affectedUserId);
                await pictureAffected.save();
                return res.status(200).json({reason: "OK"});
            }
            if (pictureAffected.shared_with.includes(req.user._id) && req.user._id !== affectedUserId){
                console.log("Found user within array, removing...");
                pictureAffected.shared_with = pictureAffected.shared_with.filter((value, index, array) => value !== req.user._id);
                await pictureAffected.save();
                return res.status(200).json({reason: "OK"});
            }
            return res.status(403).json({reason: "Picture is not shared to the specified user"});
        }
        catch (err){
            console.log(err);
            if (err instanceof CastError)
                return res.status(401).json({reason: "Invalid ID"});            
            return res.status(500).send();
        }
    }
}

module.exports = new PictureController();