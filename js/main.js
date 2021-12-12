// 1. createElemWithText
function createElemWithText (element = "p", textContent="", className=""){
    const newElem = document.createElement(element);
    newElem.textContent = textContent;
    newElem.className = className;

    return newElem;
}

// 2. createSelectOptions
function createSelectOptions (users) {

    if (!users) return;

    const optionElems = [];

    for (let i = 0; i < users.length; i++){
        const option = document.createElement("option");
        option.value = users[i].id;   
        option.textContent = users[i].name;
        
        
        optionElems.push(option);
    }

    return optionElems;
}

// 3. toggleCommentSection
function toggleCommentSection (postId) {
    if (!postId) return;

    let section = document.querySelector(`section[data-post-id='${postId}']`);
    if (section === null)
        return null;

    const classes = section.classList.toggle('hide');
    return section;

}

// 4. toggleCommentButton
function toggleCommentButton(postId){
    if (!postId) return;

    let button = document.querySelector(`button[data-post-id='${postId}']`);
    if (button === null)
        return null;
    
    button.textContent = button.textContent == "Show Comments"? "Hide Comments" : "Show Comments"; 
    return button;
}

// 5. deleteChildElements
function deleteChildElements (parentElement) {
    if(!parentElement?.tagName) return;

    let child = parentElement.lastElementChild;

    while (child){
        parentElement.removeChild(child);
        child = parentElement.lastElementChild; 
    }
    return parentElement;
}

// 6. addButtonListeners
function addButtonListeners() {
    const main = document.querySelector("main");
    const button = main.querySelectorAll("button");
 
    for( let i = 0; i < button.length; i++){

        let postId= button[i].dataset.postId;
        button[i].addEventListener("click", function (e) {toggleComments(e, postId)});
    }
    return button;
}

// 7. removeButtonListeners
function removeButtonListeners () {

    const main = document.querySelector("main");
    const button = main.querySelectorAll("button");
    for( let i = 0; i < button.length; i++){

        let postId= button[i].dataset.postId;
        button[i].removeEventListener("click", function (e) {toggleComments(e, postId)});
    }

    return button;
}

// 8. createComments
function createComments (comments) {
    if (!comments) return;

    const fragment = document.createDocumentFragment();

    for(let i = 0; i < comments.length; i++){
        const article = document.createElement("article");
        const h3 = createElemWithText("h3", comments[i].name);
        const para1 = createElemWithText("p", comments[i].body);
        const para2 = createElemWithText("p", `From: ${comments[i].email}`);
        article.append(h3, para1, para2);
        fragment.append(article);
    }

    return fragment;
}

// 9. populateSelectMenu
function populateSelectMenu (users) {
    if (!users) return;

    const selectMenu = document.querySelector("#selectMenu");
    const optionElements = createSelectOptions(users);

    for(let i = 0; i < optionElements.length; i++) {
        selectMenu.append(optionElements[i]);
    }
    return selectMenu;
}

// 10. getUsers

const getUsers = async () => {
    try{
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
    
        if(!res.ok) throw new ErrorEvent("Status code not in 200-299 range");
    
        return await res.json();
    } catch (err) {
    console.error(err);
    }   
}

// 11. getUserPosts
const getUserPosts = async (userId) => {
    if(!userId) return;
    try{
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);
    
        if(!res.ok) throw new ErrorEvent("Status code not in 200-299 range");
    
        return await res.json();
    } catch (err) {
    console.error(err);
    }   
}

// 12. getUser
const getUser = async (userId) => {
    if(!userId) return;
    try{
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    
        if(!res.ok) throw new ErrorEvent("Status code not in 200-299 range");
    
        return await res.json();
    } catch (err) {
    console.error(err);
    }   
}

// 13. getPostComments
const getPostComments = async (postId) => {
    if(!postId) return;

    try{
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
    
        if(!res.ok) throw new ErrorEvent("Status code not in 200-299 range");
    
        return await res.json();
    } catch (err) {
    console.error(err);
    }   
}

 //14. displayComments
 async function  displayComments (postId) {
    if(!postId) return;
    
    let section = document.createElement("section");
    section.dataset.postId = postId;
    section.classList.add("comments", "hide");
    let comments = await getPostComments(postId);
    let fragment = createComments(comments);
    section.append(fragment);

    return section;
}

// 15. createPosts
async function  createPosts (posts) {
    if(!posts) return;
    let fragment = document.createDocumentFragment();

    for(let i= 0; i < posts.length; i++){

        let article = document.createElement("article");
        let h2 = createElemWithText("h2", posts[i].title);
        let p1 = createElemWithText("p", posts[i].body);
        let p2 = createElemWithText("p", `Post ID: ${posts[i].id}`);
        let author = await getUser(posts[i].userId);
        let p3 = createElemWithText("p", `Author: ${author.name} with ${author.company.name}`);
        let p4 = createElemWithText("p", `${author.company.catchPhrase}`);

        let button = createElemWithText("button", 'Show Comments');
        button.dataset.posts = posts.id;

        let section = await displayComments (posts[i].id);

        article.append(h2, p1, p2, p3, p4, button, section);
        fragment.append(article);
    }
    return fragment;
}
// 16. displayPosts
async function  displayPosts (posts) {

    let main = document.querySelector("main");
    let element = (!posts) ? createElemWithText("p", "Select an Employee to display their posts.", "default-text") : await createPosts(posts);
    main.append(element);
    return element;

}
// 17. toggleComments
function toggleComments (event, postId) {
    if(!event || !postId) return;

    event.target.listener = true;
    const section = toggleCommentSection (postId);
    const button = toggleCommentButton(postId);
    return [section, button];


}
// 18. refreshPosts
async function refreshPosts (posts) {
    if(!posts) return;

    let removeButtons = removeButtonListeners();
    let main = document.querySelector("main");
    main = deleteChildElements (main);
    let fragment = await displayPosts (posts);
    let addButtons = addButtonListeners();

    return [removeButtons, main, fragment, addButtons];

}
// 19. selectMenuChangeEventHandler
async function selectMenuChangeEventHandler (e) {
    let userId = e?.target?.value || 1;
    let posts = await getUserPosts(userId);
    let refreshPostsArray = await refreshPosts (posts);

    return [ userId, posts, refreshPostsArray];

}
// 20. initPage
async function initPage () {
    const users = await getUsers();
    const select = populateSelectMenu(users);
    return [users, select];
}
// 21. initApp
function initApp () {
    initPage();
    let selectMenu =  document.querySelector('#selectMenu');
    selectMenu.addEventListener("change", function (e) {selectMenuChangeEventHandler(e)});
    document.addEventListner("DOMContentLoaded", function (e) {initApp()});
}

   document.addEventListener('DOMContentLoaded', initApp);
