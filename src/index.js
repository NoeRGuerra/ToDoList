import './views/style.css';
import { addDefaultList, displayToDoList, createDemoLists, populateListsContainer, existingLists } from './controllers/todoListController';

addDefaultList();
createDemoLists();
populateListsContainer();
displayToDoList(existingLists[0]);