var sharp = require('sharp'),
    AWS = require('aws-sdk'),
    fs = require('fs'),
    request = require('request');

AWS.config.update({ accessKeyId: 'YOUR KEY', secretAccessKey: 'YOUR KEY' });
var s3URL = 'https://S3 URL.amazonaws.com/';
var bucketName = 'BUCKET NAME';
var s3 = new AWS.S3();

var params = {
    Bucket: bucketName,
    MaxKeys: 10000
};

s3.listObjectsV2(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data);

    for (var i = 0; i < data.Contents.length; i++) {
        console.log(data.Contents[i].Key);
        download(s3URL + data.Contents[i].Key,
            'down/' + data.Contents[i].Key, function () {
                console.log("downloaded")
            });
    }
});

var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

const downloaded_folder = './down';

fs.readdirSync(downloaded_folder).forEach(file => {
    s3up(file)
})

function s3up(url) {
    fs.readFile("down/" + url, function (err, data) {
        if (err) { throw err; }
        var base64data = new Buffer(data, 'binary');
        var s3 = new AWS.S3();
        console.log("-- " + url);

        s3.upload({
            Bucket: 'tripazing-prod',
            Key: 'original/' + url,
            Body: base64data,
            ACL: 'public-read'
        }, function (err, resp) {
            console.log("--- " + url);
            var url_new = url.replace("jpeg", "jpg")
            sharp("down/" + url)
                .resize(1024)
                .toBuffer((err, data, info) => {
                    if (err) { throw err; }
                    var base64data = new Buffer(data, 'binary');
                    var s3 = new AWS.S3();

                    s3.upload({
                        Bucket: 'tripazing-prod',
                        Key: 'large/' + url_new,
                        Body: base64data,
                        ACL: 'public-read'
                    }, function (err, resp) {
                        console.log("---- " + url);

                        sharp("down/" + url)
                            .resize(512)
                            .toBuffer((err, data, info) => {
                                if (err) { throw err; }
                                var base64data = new Buffer(data, 'binary');
                                var s3 = new AWS.S3();

                                s3.upload({
                                    Bucket: 'tripazing-prod',
                                    Key: 'small/' + url_new,
                                    Body: base64data,
                                    ACL: 'public-read'
                                }, function (err, resp) {
                                    console.log('Successfully uploaded image.');
                                });

                            });
                    });

                });
        });

    });

}