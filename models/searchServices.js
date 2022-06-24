const fs = require('fs');

require('dotenv').config();
const { default: axios } = require("axios");


class SearchServices {

    history = [];
    dataBasePath = './dataBase/database.json';

    constructor(){
        this.readDB();
    }

    get historyCapitalize(){
        return this.history.map( place => {
            let words = place.split(' ');
            words = words.map( word => word[0].toUpperCase() + word.substring(1));

            return words.join(' ');
        })
    }
    
    get paramsMapBox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    async searchCity( city = '' ){

        const instanceAxios = axios.create({
            baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json`,
            params: this.paramsMapBox
        })

        const response = await instanceAxios.get();
        
        return response.data.features.map( place => ({
            id: place.id,
            name: place.place_name,
            longitud: place.center[0],
            latitud: place.center[1],
        }))
    }

    get paramsOpenWeather() {
        return {
            'units': 'metric',
            'appid': process.env.OPENWEATHER_KEY,
            'lang': 'es'
        }
    }

    async serchCityStatus( latitud, longitud) {
        const instanteAxios = axios.create({
            baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${latitud}&lon=${longitud}`,
            params: this.paramsOpenWeather
        })

        const response = await instanteAxios.get();

        const description = response.data.weather[0].description

        const { 
                temp: temperatura, 
                temp_min: temperaturaMinima, 
                temp_max: temperaturaMaxima
            } = response.data.main
        
        return { description, temperatura, temperaturaMinima, temperaturaMaxima };
    }

    addHistory( place = '' ){

        if ( this.history.includes(place.toLocaleLowerCase())){
            return;
        }

        this.history = this.history.splice(0,5);

        this.history.unshift(place.toLocaleLowerCase());

        this.saveDB();
    }

    saveDB(){

        const payload = {
            history: this.history
        }

        fs.writeFileSync(this.dataBasePath, JSON.stringify(payload));
    }

    readDB(){
        if(fs.existsSync(this.dataBasePath)){
            const info = fs.readFileSync(this.dataBasePath, {encoding: 'utf-8'});

            const data = JSON.parse( info );

            this.history = data.history;
            
        }else{
            return;
        }
    }
}

module.exports = SearchServices