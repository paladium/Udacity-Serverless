import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

export class S3Access {
    constructor(
        private readonly XAWS = AWSXRay.captureAWS(AWS),
        private bucketName = process.env.IMAGES_S3_BUCKET,
        private readonly s3Client: AWS.S3 = new XAWS.S3({
            signatureVersion: 'v4',
            region: process.env.region,
            params: { Bucket: bucketName },
        }),
        private readonly signedUrlExpireSeconds = 60 * 10
    ) {

    }
    getPresignedUrl(todoId: string): string {
        return this.s3Client.getSignedUrl("putObject", {
            Bucket: this.bucketName,
            Key: `${todoId}.png`,
            Expires: this.signedUrlExpireSeconds
        });
    }
    getAttachmentUrl(attachment: string): string{
        return this.s3Client.getSignedUrl("getObject", {
            Bucket: this.bucketName,
            Key: attachment,
            Expires: this.signedUrlExpireSeconds
        });
    }
}