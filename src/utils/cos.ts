import axios from '@/axios/http';

const putFile = (fileObject: File, fileKey: String) => {
    if (!fileObject || !fileKey) {
        throw new Error('请传入 fileObject 和 fileKey');
    }

    return new Promise(async (resolve, reject) => {
        // 初始化实例
        const res: any = await axios.get({
            url: '/sso/oss/sts'
        });
        if (res?.code == 200) {
            const { Credentials, StartTime, ExpiredTime } = res.data?.credential_result;
            const { bucket, region } = res.data?.cos_config;
       
            
            // @ts-ignore

            var cos = new COS({
                // getAuthorization 必选参数
                getAuthorization: function (options: any, callback: any) {
                    callback({
                        TmpSecretId: Credentials.TmpSecretId,
                        TmpSecretKey: Credentials.TmpSecretKey,
                        SecurityToken: Credentials.Token,
                        StartTime: StartTime,
                        ExpiredTime: ExpiredTime
                    });
                }
            });

            cos.putObject(
                {
                    Bucket: bucket /* 填入您自己的存储桶，必须字段 */,
                    Region: region /* 存储桶所在地域，例如ap-beijing，必须字段 */,
                    Key: fileKey /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
                    StorageClass: 'STANDARD',
                    Body: fileObject // 上传文件对象
                },
                function (err: any, data: any) {
                    if (err) {
                        console.log(err);
                        throw new Error('上传失败，请检查是否正确配置cos');
                    } else {
                        resolve(`https://${data.Location}`);
                    }
                }
            );
        }
    });
};

export { putFile };
