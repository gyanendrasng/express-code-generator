import { capitalizeFirstLetter } from '../helpers';

export const controllerSnippet = (controllerName: string) => `
const ${controllerName}Controller = {

    create${capitalizeFirstLetter(controllerName)}: async (req, res) => { 
        //enter your code here
    },

    get${capitalizeFirstLetter(controllerName)}: async (req, res) => {
        //enter your code here
    },

    get${capitalizeFirstLetter(controllerName)}ById: async (req, res) => {
        //enter your code here
    },

    update${capitalizeFirstLetter(controllerName)}: async (req, res) => {
        //enter your code here
    },

    delete${capitalizeFirstLetter(controllerName)}: async (req, res) => {
        //enter your code here
    }

}

export default ${controllerName}Controller;
`;
