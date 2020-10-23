document.addEventListener('DOMContentLoaded', () => {
    const tableRow = document.querySelectorAll('.result');
    const resultsPerPage = 5;
    const ul = document.querySelector("ul");
    document.querySelector('.pagination ul li a').className='active';


    for(let i = resultsPerPage; i < tableRow.length; i++) {
        tableRow[i].style.display = 'none';
    }
    // showPage takes two arguments (list and page) and lists the items on the selected page.
    function showPage(list, page) {
        // Setting a start and end index based on the page number and the max amount of items we want to show on that page.
        const startIndex = (page * resultsPerPage) - resultsPerPage;
        const endIndex = (page * resultsPerPage);
        // Looping over all the items in the list, show only those that are between the start and end indexes, hide the rest of the items.
        for (let i = 0; i < list.length; i += 1) {
        if (i >= startIndex && i < endIndex) {
            list[i].style.display = '';
        } else {
            list[i].style.display = 'none';
        }
        }
    }

    ul.addEventListener('click', (e) => {
        const anchors = document.querySelectorAll('.pagination ul li a');
        for (let i = 0; i < anchors.length; i++) {
            anchors[i].className = '';
        }
        showPage(tableRow, e.target.textContent);
        e.target.className = 'active'
    })
});