function areThisObjectsEqual(objOne, objTwo) {
    if(Object.keys(objOne).length > Object.keys(objTwo).length) {
        for(let key in objOne) {
            if(objOne[key] !== objTwo[key]) {
                return false;
            }
        }
    } else {
        for(let key in objTwo) {
            if(objOne[key] !== objTwo[key]) {
                return false;
            }
        }
    }
    return true;
}

let obj1 = {nome: "yoyo", id: 4, sobrenome: "lops"};
let obj2 = {nome: "yoyo", id: 4}

areThisObjectsEqual(obj2, obj1)