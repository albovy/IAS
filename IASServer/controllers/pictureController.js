const multer = require('multer');
const Picture = require('../models/Picture');
var path = require('path');
const { exception } = require('console');
const { fstat, existsSync, unlinkSync } = require('fs');

const { CastError } = require('mongoose/lib/error/cast');
const User = require('../models/User');
var upload = multer({
    storage: multer.diskStorage({
        destination: './pictures',
        filename: function (req, file, cb) {
            var dest = './pictures';
            var _fileName = `${req.user._id}_${Date.now().toString()}${path.extname(file.originalname)}`;    
            cb(null, _fileName);
        }
    })
    });

class PictureController{
    constructor(){}

    uploadPicture(req, res, next)  {

        upload.single('fichero')(req, res, function (err) {
            if (err) {
                return res.end("Something went wrong!");
            }

            const filePath = req.file.path;
            const fileName = req.file.filename;

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

            if (!existsSync(resolvePicturePath)){
                return res.status(404).json({reason: "Picture not found"});
            }
            return res.download(resolvePicturePath, (err => {
                if (err)
                    console.log(err);
            }) );
        }
        catch (err){
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
        const pictureId = req.params.picture_id;

        if (pictureId == null)
            return res.status(403).json({reason: "Param_id empty"});

        try{
            const pictureAffected = await Picture.findById(pictureId);
            if (pictureAffected == null)
                return res.status(404).json({reason: "Picture not found"});
            if (pictureAffected.shared_with.includes(req.user._id)){
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