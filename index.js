const express = require ('express');
const axios = require ('axios');
const redis = require ('redis');
const app = express();
const port = 5000;
const redis_port = 6379;
const redisClient = redis.createClient(redis_port);

app.get('/repos/:username', async (req, res) => {
    try{
        const {username} = req.params;  
        redisClient.get(username, async (error, data) => {
            if (error) {
                console.log('error -', error);
            }
            else if(data){
                console.log('fetching from cache...');
                return res.send({public_repos : data});     
            }
            else{              
                const response = await axios(`https://api.github.com/users/${username}`);
                console.log('fetching from api...');
                const {public_repos} = response.data;
                redisClient.set(username, public_repos);
                return res.send({public_repos});
            }
        }) 
    }catch (error){
        console.log(error);
    }
})
app.listen(port, (req, res) =>{
    console.log('server listining at port -', port);
})