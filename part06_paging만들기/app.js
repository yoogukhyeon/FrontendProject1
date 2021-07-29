//2개화면 리팩토리 

const container = document.getElementById('root');
const ajax = new XMLHttpRequest();
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

const store = {
    currentPage: 1,
}

//반복코드 getDate함수안에 ajax 코드를 넣고 url바뀔수 있어 인자 값에 url을 줍니다
function getDate(url){
    ajax.open('GET', url , false);
    ajax.send();

    //ajax.response 반환값 return
    return JSON.parse(ajax.response);
};

//ajax getDate 함수를 통해서 불러와서 코드를 줄인다

const ul = document.createElement('ul');

//문자열로 html 만들기 되도록 DOM객체에 Element속성을 안쓰고 UI를 구성하는것이 효율적이고 좋음 
//지금은 연습이라서 코드를 계속 만들어보는것입니다!

function newsFeeds(){
    const newsFeed = getDate(NEWS_URL)
    
const newsList = [];
    newsList.push(`<ul>`)
    for(let i = (store.currentPage -1) * 10; i < store.currentPage * 10; i++) {
        const div = document.createElement('div');
        newsList.push(`  
            <li>
                <a href="#${newsFeed[i].id}"> 
                ${newsFeed[i].title} (${newsFeed[i].comments_count})       
                </a>
            </li>
        `);
    }
    newsList.push(`</ul>`);
    newsList.push(`
        <div>
            <a href="#/page/${store.currentPage > 1 ? store.currentPage -1 : 1}">이전 페이지</a>
            <a href="#/page/${store.currentPage + 1}">다음 페이지</a>
        </div>
    `)

    container.innerHTML = newsList.join('')
}

function newsDetail(){
        const id = location.hash.substr(7);
        const newsContent = getDate(CONTENT_URL.replace('@id' , id));
        container.innerHTML = `
                <h1>${newsContent.title}</h1>
                <a href="/">
                    목록으로
                </a>
                `
}

function router(){
    const routerPath = location.hash;

    if(routerPath === ""){
        newsFeeds();
    }else if(routerPath.indexOf('#/page/') >= 0){
        store.currentPage = Number(routerPath.substr(7));
        newsFeeds();
    }else{
        newsDetail();
    }
}

window.addEventListener('hashchange', router)
router();