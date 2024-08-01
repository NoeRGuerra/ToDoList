import './views/style.css';
import { displayToDoList, createDemoLists, populateListsContainer, existingLists, addTopLists } from './controllers/todoListController';

addTopLists();
createDemoLists();
populateListsContainer();
displayToDoList(existingLists[0]);