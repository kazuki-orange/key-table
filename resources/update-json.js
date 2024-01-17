const fs = require('fs');

exports.handler = async (event) => {
    const updatedData = event.body;
    console.log(updatedData);
    fs.writeFileSync('./key_list.json', updatedData);

    return {
        statusCode: 200
    };
};
