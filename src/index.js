import './views/style.css';
import { createDemoLists, populateLeftSidebar, showDefaultList } from './controllers/todoListController';

// if (existingLists.length <= 1){
//     createDemoLists();
// }
populateLeftSidebar();
showDefaultList();