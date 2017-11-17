import serverData from './data';

const artificialDelay = 500;
const delay = (time) => (result) => new Promise(resolve => setTimeout(() => resolve(result), time));

const list = [...serverData];

export function getList(path) {
    // console.log('getList');
    return Promise.resolve([...list]).then(delay(artificialDelay));
}

export function postData(path, item) {
    list.push(item);
    return Promise.resolve([...list]).then(delay(artificialDelay));
}

export function remove(path, item) {
    const index = list.indexOf( item );
    list.splice( index, 1 )
    return Promise.resolve([...list]).then(delay(artificialDelay));
}