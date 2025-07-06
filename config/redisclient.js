import Redis from 'ioredis';

const redis= new Redis({
    port: 6379,
    host: 'localhost'
})

redis.on('connection',()=> {
    console.log('connected');
});
redis.on('error', (err)=>{
    console.error('Please try again later, we are facing some issues.', err);
});


export default redis;