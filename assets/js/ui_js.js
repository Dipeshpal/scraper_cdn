let checkedFilters = [];

const handleSubmitClick = () => {
    let filters = {};
    filters['channels'] = checkedFilters;
    filters['filter'] = {};
    let checkboxes = document.getElementsByClassName('filter-item-checkbox');
    let selectitems = Array.from(checkboxes)
        .filter(item => item.checked)
        .map(item => item.value.split('#'))
    selectitems.map(item => {
        if (filters['filter'][item[0]]) {
            (filters['filter'][item[0]]).push(item[1])
        } else {
            filters['filter'][item[0]] = [item[1]]
        }
    })
    console.log('Selected filters ===>', filters)
    let requestBody = {
        "keywords_data": [],
        "available_crawlers": filters.channels
    }
    for (key in filters.filter) {
        requestBody.keywords_data = [...requestBody.keywords_data, ...filters.filter[key]]
    }
    fetch('http://127.0.0.1:8000/api/index', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(requestBody)
    })
        .then(res => res.json())
        .then(res => {
            if (res.status == 0) {
                // document.getElementById('myModal').

                $('#myModal').modal('toggle');


            } else {
                window.location.replace("http://127.0.0.1:8000/results/")
            }
        });


    // window.location.replace("http://127.0.0.1:8000/results/")
}

const handleCheckBoxItemClick = (e) => {
    // e = e || window.event;
    // var targ = e.target || e.srcElement || e;
    // if (targ.nodeType == 3) targ = targ.parentNode; // defeat Safari bug
    // let tempIndex= checkedFilters.indexOf(e.target.value);
    // tempIndex > -1 ? checkedFilters.splice(tempIndex, 1): checkedFilters.push(e.target.value);
    //
    // if (tempIndex > -1) document.getElementById('mainSubmitBtn').disabled = true;

    checkedFilters = ['amazon', 'bestbuy', 'acer'];
    let url = 'http://127.0.0.1:8000/';

    fetch(url)
        .then(res => res.json())
        .then((out) => {
            console.log('Checkout this JSON! ', out);
            return out
        })
        .then((out) => renderFilter(out))
        .catch(err => {
            throw err
        });

    // fetch('./search.json')
    //     .then(res => res.json())
    //     .then(data => renderFilter (data, e.target.value))
}

const renderFilter = (data) => {
    const node = document.getElementById("filters");
    console.log('Checkout this', data)
    let str = "";
    // let temp = parseData(data);
    let temp = {
      ...getCountry(data),
      ...getProductkey(data)
    };
    const keys = Object.keys(temp);
    keys.map(item => {
        str = str + `<div class="filter-item"><div class="filter-item-title">${item}</div><div class="filter-item-body">${renderDropDown(temp[item], item)}</div></div>`
    })
    node.innerHTML = str;
}

const renderDropDown = (arr, type) => {
    let str = "";
    let dropDownStr = "";
    let filterArr = arr.filter((item, index) => arr.indexOf(item) === index);
    filterArr.map(pdt => {
        dropDownStr = dropDownStr + `<div><input onClick='upDateSelectedUI(event)' value= '${type}#${pdt}' class='filter-item-checkbox' name='${type}' type='radio'>${pdt}</input></div>`
    })
    return `<div class="filter-dropdown"><div id="filter-dropdown-selected">Select a value to start</div><div class="filter-dropdown-body">${dropDownStr}</div></div>`
}

const upDateSelectedUI = (e) => {
    document.getElementById('mainSubmitBtn').disabled = false;
    e.target.parentNode.parentNode.parentNode.children[0].innerHTML = (e.target.value.split('#'))[1];
}

const parseData = (data) => {
    let dataParsed = {};
    checkedFilters.map(item => {
        let temp = data[item];
        let attrs = Object.keys(temp);
        attrs.map(attr => {
            if (dataParsed[attr]) {
                dataParsed[attr] = [...dataParsed[attr], ...temp[attr]]
            } else {
                dataParsed[attr] = temp[attr]
            }
        })
    })
    return dataParsed;
}

const getCountry = (data) => {
  return {
    country: data.country
  }
}

const getProductkey = (data) => {
  return {
    "productkey": data.productkey
  }
}