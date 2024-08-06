import './views/style.css';
import { displayToDoList, createDemoLists, populateListsContainer, existingLists, addTopLists } from './controllers/todoListController';

addTopLists();
if (existingLists.length <= 1){
    createDemoLists();
}
populateListsContainer();
displayToDoList(existingLists[0]);