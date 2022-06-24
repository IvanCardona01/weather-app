require('colors');

const { readInput, inquirerMenu, pause, confirmation, cityList } = require("./helpers/inquirer");
const SearchServices = require('./models/searchServices');

const main = async() => {
    const searchServices = new SearchServices();
    let exit = false;
    do{
        const option = await inquirerMenu();

        switch(option){
            case '1':
                const city = await readInput('Ciudad: '.gray);
                const places = await searchServices.searchCity(city);

                console.log('\nResultados de busqueda: \n'.green);

                const id = await cityList(places);

                console.clear();

                if ( id === '0' ) continue;

                const placeSelected = places.find( place => place.id === id);
            
                searchServices.addHistory(placeSelected.name);

                console.log('Informacion de la ciudad:'.green);
                console.log('Ciudad:'.green , placeSelected.name);
                console.log('Latitud:'.green , `${placeSelected.latitud}`.white);
                console.log('Longitud:'.green , `${placeSelected.longitud}`.white);

                const latitud = placeSelected.latitud;
                const longitud = placeSelected.longitud;

                const placeStatus = await searchServices.serchCityStatus( latitud, longitud);

                if(placeStatus){
                    console.log('Clima: '.green, `${placeStatus.description}`.white);
                    console.log('Temperatura: '.green, `${placeStatus.temperatura}`.white);
                    console.log('Máxima: '.green, `${placeStatus.temperaturaMinima}`.white);
                    console.log('Mínima: '.green, `${placeStatus.temperaturaMaxima}`.white);
                }

                
                break;
            case '2':

                searchServices.historyCapitalize.forEach( ( place, index) => {
                    const indexColor = `${index + 1}`.green;
                    console.log(`${ indexColor } ${place}`);
                })

                break;
            case '3':
                console.clear();
                const confirmated = await confirmation('¿Estas seguro de salir?'.yellow);
                if ( confirmated ) exit = true;
                break;
            default:
                console.clear();
                console.log('Opcion no valida'.red)
                break;
        }

        if( option !== '3' ) await pause();
    }while(!exit);
    console.clear();
}   

main();