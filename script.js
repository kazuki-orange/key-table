const startApp = () => {
    const json = './key_list.json';
    return new Promise((resolve) => {
        $.getJSON(json, (data) => {
            const key_list = data;
            resolve(key_list);
        })
            .then((data) => {
                main(data);
            });
    });
};

const main = (data) => {
    const key_list = data;
    
    const scroll_box = document.getElementById('scrollable-box'); 

    const assignNewIdAndWriteJson = () => {
        let numOfEls = scroll_box.children.length;
        for (let i = 0; i < numOfEls; i++) {
            let hiddenCheckBox = scroll_box.children[i].children[1].children[0];
            let toggleButton = scroll_box.children[i].children[1].children[1];
            hiddenCheckBox.setAttribute('id', `btn${i}`);
            toggleButton.setAttribute('for', `btn${i}`);
        };

        let overwriteJson = {};
        for (let i = 0; i < numOfEls; i++) {
            let obj = {};
            let input = scroll_box.children[i].children[0].children[0]
            obj['name'] = input.value;
            let hiddenCheckBox = scroll_box.children[i].children[1].children[0];
            if (hiddenCheckBox.checked === false) {
                obj['state'] = 'normal';
            } else {
                obj['state'] = 'down';
            };
            overwriteJson[`key_${i}`] = obj;
        };

        overwriteJson = JSON.stringify(overwriteJson, null, 4);
        console.log(overwriteJson);

        $.post({
            url: '/.netlify/functions/update-json',
            data: overwriteJson,
            dataType: 'json',
            success: function(response) {
                console.log(response);
                // Handle the response here
            }
        });
    };

    const element = (value, bool) => {
        let numOfEls = scroll_box.children.length;

        let container = document.createElement('div');
        container.setAttribute('class', 'container');
        let text_box = document.createElement('div');
        text_box.setAttribute('class', 'text-box');
        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('class', 'text');
        input.setAttribute('value', `${value}`);
        input.addEventListener('blur', assignNewIdAndWriteJson); 
        let button_box = document.createElement('div');
        button_box.setAttribute('class', 'button-box');
        let hiddenCheckBox = document.createElement('input');
        hiddenCheckBox.setAttribute('type', 'checkbox');
        hiddenCheckBox.setAttribute('id', `btn${numOfEls}`);
        hiddenCheckBox.checked = bool;
        hiddenCheckBox.setAttribute('class', 'checkbox');
        hiddenCheckBox.addEventListener('click', assignNewIdAndWriteJson);  
        let toggleButton = document.createElement('label');
        toggleButton.setAttribute('for', `btn${numOfEls}`);
        toggleButton.setAttribute('class', 'btn');  
    
        text_box.appendChild(input);
        button_box.appendChild(hiddenCheckBox);
        button_box.appendChild(toggleButton);
        container.appendChild(text_box);
        container.appendChild(button_box);

        return container;
    };

    for (let key in key_list) {
        if (key_list[key]['state'] === 'normal') {
            scroll_box.appendChild(element(key_list[key]['name'], false));
        } else {
            scroll_box.appendChild(element(key_list[key]['name'], true));
        }
    };

    const searchElement = () => {
        let numOfEls = scroll_box.children.length;
        let searchedStrBox = document.getElementById('search-box');
        let searchedStr = searchedStrBox.value;
        console.log(searchedStr);
        for (let i = 0; i < numOfEls; i++) {
            let input = scroll_box.children[i].children[0].children[0];
            if (input.value.includes(searchedStr)) {
                let box = input.parentNode.parentNode
                scroll_box.removeChild(box);
                scroll_box.insertBefore(box, scroll_box.firstChild);
            };
        };

        assignNewIdAndWriteJson();
    }; 

    const addElement = () => {
        scroll_box.appendChild(element('', false));
    };

    const removeElement = () => {
        let numOfEls = scroll_box.children.length;
        let count = 0;
        for (let i = 0; i < numOfEls; i++) {
            let input = scroll_box.children[i-count].children[0].children[0];
            if (input.value == '') {
                let box = scroll_box.children[i-count];
                box.parentNode.removeChild(box);
                count++;
            };
        };

        assignNewIdAndWriteJson();
    };

    const search_button = document.getElementById('search');
    search_button.addEventListener('click', searchElement);

    const add_button = document.getElementById('add');
    add_button.addEventListener('click', addElement);

    const remove_button = document.getElementById('remove');
    remove_button.addEventListener('click', removeElement);
};

window.onload = () => {
    startApp();
};
