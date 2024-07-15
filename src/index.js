import './views/style.css';
import { addDefaultList, displayToDoList, createDemoLists, populateListsContainer, existingLists, addAllTasks } from './controllers/todoListController';

addDefaultList();
addAllTasks();
createDemoLists();
populateListsContainer();
displayToDoList(existingLists[0]);