# Migrate and Resize Images in AWS S3 Buckets

We used this application to download all the files from an S3 Bucket and then resize and migrate them to another S3 Bucket. 

### Scenario Faced
Having around 500 bulk images in S3 bucket and the web app performace was affected. It was required to create two versions for each image, one with 1024 pixels wide and another with 512 pixels wide (for thumbnails). And all the images should be organized properly and migrated to another S3 bucket.

### Process

1. Download all the images from the existing S3 Bucket (local folder)
2. For Each image downloaded,
3. Upload the original image to the new S3 with a folder key **(original/)**
4. Resize the original image to 1024pixels - This was done using [sharp](http://sharp.pixelplumbing.com/en/stable/ "sharp") for NodeJS.
5. Upload the resized image to the new S3 with a folder key **(large/)**
6. Resize the original image to 512pixels using sharp
7. Upload the original image to the new S3 with a folder key **(small/)** 

### Dependencies

- NodeJS 
- AWS JS SDK
- [Sharp](http://sharp.pixelplumbing.com/en/stable/ "sharp")  
- request and fs


### Setup

```javascript
AWS.config.update({ accessKeyId: 'YOUR KEY', secretAccessKey: 'YOUR KEY' });
var s3URL = 'https://S3 URL.amazonaws.com/';
var bucketName = 'BUCKET NAME';
```

### Customize

Fork and customize to achieve the required task.

