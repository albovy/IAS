const multer = require('multer');
const Picture = require('../models/Picture');
var path = require('path');
const fs =  require('fs');
const crypto = require('crypto');

const config = require('../config.json')

const { CastError } = require('mongoose/lib/error/cast');
const { parse } = require('path');
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
            picture.desciption = req.body.description
            picture.username = user.user.username
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

            if (!(req.user._id === response.owner_id || response.public))
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


    async getAllOwnedPictures (req, res, next) {
        const skip = parseInt(req.query.skip);
        const limit = parseInt(req.query.limit);

        // Endpoint para saber que fotografias tengo
        console.log('getAllOwnedPictures endpoint');
        console.log(`Requester user: ${req.user._id}`)
        const myPictures = await Picture.find({owner_id: req.user._id}).skip(skip).limit(limit);

        return res.status(200).json(myPictures);
    }


}

module.exports = new PictureController();