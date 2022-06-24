const inquirer = require('inquirer');
require('colors');

const menuOptions = [
    {
        type: 'list',
        name: 'option',
        message: '¿Qué deseas hacer?',
        choices: [
            {
                value:'1',
                name: `Buscar ciudad`            
            },
            {
                value: '2',
                name: 'Historial'
            },
            {
                value:'3',
                name: 'Salir'
            }
            ]
    }
];

const inquirerMenu = async() => {
    console.clear();
    console.log('========================='.green);
    console.log('  Seleccione una opcion  '.grey);
    console.log('========================='.green);

    const {option} = await inquirer.prompt(menuOptions)
    return option;
}


const pause  = async() => {
    const pauseOption = [
        {
            type: 'input',
            name: `Press`,
            message: `Presione ${'ENTER'.green} para continuar\n`,
        }
    ]
    console.log('\n');
    return await inquirer.prompt(pauseOption)
}

const readInput = async( message ) => {
    const question = [
        {
            type: 'input',
            name: 'description',
            message,
            validate( value ) {
                if(value.length === 0) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const { description } = await inquirer.prompt( question );
    return description;
}

const cityList = async( places = [] ) => {

    const choices = places.map( (place, index) => {
        
        const indexColor = `${index+1}`.green;

        return {
            value: place.id,
            name: `${indexColor} ${place.name}`
        }
    });

    choices.unshift({
        value: '0',
        name: '0 '.green + 'Cancelar'
    })

    const questions = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione',
            choices
        }
    ]

    const { id } = await inquirer.prompt( questions );

    return id;
}

const confirmation = async( message ) => {
    const questions = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ]
    const { ok } = await inquirer.prompt(questions);
    return ok;
}


const showTaskChecklist = async( tasks ) => {

    const choices = tasks.map( (task, index) => {
        
        const indexColor = `${index+1}`.green;

        return {
            value: task.id,
            name: `${indexColor} ${task.description}`,
            checked: task.completed ? true : false
            
        }
    });

    const questions = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione',
            choices
        }
    ]

    const { ids } = await inquirer.prompt( questions );

    return ids;
}


module.exports = {
    inquirerMenu,
    readInput,
    pause,
    cityList,
    confirmation,
    showTaskChecklist
}