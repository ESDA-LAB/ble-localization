const config = require('config');
const Minio = require('minio');
const fs = require('fs')

const TEMPORARY_FOLDER = config.get('common.temporary.folder')
const minioClient = new Minio.Client({
    endPoint: config.get('adapters.minio.url'),
    port: config.get('adapters.minio.port'),
    useSSL: config.get('adapters.minio.url').includes('https'),
    accessKey: config.get('adapters.minio.accessKey'),
    secretKey: config.get('adapters.minio.secretKey')
});

/**
 * Validating the existence of the buckets.
 */
config.get('adapters.minio.buckets').forEach(bucket => {
    console.log(`Checking bucket ${bucket} for existence.`);
    minioClient.bucketExists('ns3-sources', function(err, exists) {
        if (err) console.error(`Unable to check bucket ${bucket} for existence`, err);
        console.log(`Bucket ${bucket} ${exists?'':'not'} exists..`)
    })
});

module.exports = {

    /**
     * Downoad a file from MinIO.
     * @param bucket
     * @param filename
     */
    downloadFile: function(bucket, filename){
        return new Promise((resolve, reject) => {
            minioClient.getObject(bucket, filename, function(err, stream) {
                if (err) {
                    console.error(`Unable to download file ${filename} from bucket ${bucket} for existence`, err);
                    reject(err);
                }
                let sourceStream = stream.on('end', function() {}).pipe(fs.createWriteStream(TEMPORARY_FOLDER + filename))
                sourceStream.on('finish',function(){ resolve(TEMPORARY_FOLDER + filename)});
            });
        })

    }

}
