import './views/style.css';
import { createDemoLists, populateListsContainer, existingLists, addTopLists, showDefaultList } from './controllers/todoListController';

addTopLists();
if (existingLists.length <= 1){
    createDemoLists();
}
populateListsContainer();
showDefaultList();