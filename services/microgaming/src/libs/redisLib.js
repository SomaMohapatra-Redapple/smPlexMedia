const config  = require('../../config/appConfig');
const redis   = require("redis");

const redis_client = redis.createClient({
    url: config.redis_url
});


class RedisCache
{

    async connect() {

        try {
            await redis_client.connect();

            redis_client.on('error', (err) => {
                console.log("REDIS Error " + err)
                return false;
            });

            return true;
        } catch (error) {
            console.log('connect ' + error.message);
            return false;
        }
    }
    async add(id, data)
    {   
       try {
            if(typeof data == 'object')
                data=JSON.stringify(data);
            await redis_client.set(id, data);
        } catch(err) { 
            console.log('addToRedis ' + err.message);
            let data = {
                error : true
            }
            return data;
        }
        return {
            error : false
        };
    }

    async addWithTtl(id, data, exp)
    {   
       try {
        if(typeof data == 'object')
            data=JSON.stringify(data);
        await redis_client.set(id, data, 'EX', exp);
        } catch(err) { 

            console.log('addToRedisWithTtl ' + err.message);
            let data = {
                error : true
            }
            return data;

        }
        return {
            error : false
        };
    }

    async get(id)
 {
        const value = await redis_client.get(id)
;
        try {
            if(value) {
                let data = {
                    error : false,
                    data : JSON.parse(value)
                }
                return data;
            } 
            return false;          
        } catch(err) {
            console.log('getRecordsByKeyRedis ' + err.message);
            if(!value)
            {
                let data = {
                    error : true,
                }
                return data;
           }
            return {
                error : false,
                data : value
            };
        }
    }

    async remove(id)
 {
        try {
            await redis_client.del(id)
;

            return {
                error : false
            }
         } catch (error) {
            console.log('connect ' + error.message);
            return {
                error : true
            }
         }
    }

    // async incrFromRedis(id)
// {
//     //     const res= await redis_client.incr(id)

//     //     await redis_client.expire(id,config.socketUserExpireTime);
//     //     return res;
//     // }
//     // async incrFromRedisWithoutTtl(id)
//  {
//     //     const res= await redis_client.incr(id)

//     //     return res;
    // }
}

module.exports = new RedisCache();