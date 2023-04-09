const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.querySelector('.container');
let bookmarks = [];

// Show Modal, Focus on Input
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () =>
    modal.classList.remove('show-modal')
);
window.addEventListener('click', (e) =>
    e.target === modal ? modal.classList.remove('show-modal') : false
);

// Validate Form
function validate(nameValue, urlValue) {
    const expression = /^(ftp|http|https):\/\/[^ "]+$/;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
        alert('Please submit values for both fields.');
        return false;
    }
    if (!urlValue.match(regex)) {
        alert('Please provide a valid web address.');
        return false;
    }
    // Valid
    return true;
}

// Build Bookmarks DOM
function buildBookmarks() {
    // remove all bookmark elements to prevent duplicates
    bookmarksContainer.textContent = '';

    // Build items
    bookmarks.forEach((bookmark) => {
        const { name, url } = bookmark;
        // Item
        const item = document.createElement('div');
        item.classList.add('item');
        // Close Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        // Favicon / Link Container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        // Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute(
            'src',
            `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
        );
        favicon.setAttribute('alt', 'Favicon');
        // Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        // Append to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
}

// Fetch Bookmarks
function fetchBookmarks() {
    // Get bookmarks from localStorage if available
    if (localStorage.getItem('bookmarks') !== '[]' && localStorage.getItem('bookmarks') !== null) {
        console.log('bookmarks are found in local storage');
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        // Create bookmarks array in localStorage
        console.log('bookmarks are not found in local storage');
        bookmarks = [
            {
                name: 'Javscript',
                url: 'https://javascript.info/',
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// Delete Bookmark
function deleteBookmark(url) {
    let itemIsNotDeleted = true;
    // Buils Items
    bookmarks.forEach((bookmark, i) => {
        if (bookmark.url === url && itemIsNotDeleted) {
            itemIsNotDeleted = false;
            bookmarks.splice(i, 1);
        }
    });
    // Update bookmarks array in localStorage, re-populate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

// handle data from form
function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    console.log(!urlValue.match(/^(ftp|http|https):\/\//));
    if (!urlValue.match(/^(ftp|http|https):\/\//)) {
        urlValue = `https://${urlValue}`;
    }
    if (!validate(nameValue, urlValue)) {
        return false;
    }
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    modal.classList.remove('show-modal');
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);

// On Load, Fetch Bookmarks
fetchBookmarks();
