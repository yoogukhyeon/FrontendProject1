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

//templat 큰틀을 미리 만들기

//newfeed
function newsFeeds(){
    const newsFeed = getDate(NEWS_URL)   
    const newsList = [];

    //ui구현할 템클렛 생성
    let template = `
        <div>
            <h1>Haker News</h1>
            <ul>
            {{__news_feed__}}
            
            <ul>
            <div>
            <a href="#/page/{{__prev_page__}}">이전 페이지</a>
            <a href="#/page/{{__next_page__}}">다음 페이지</a>
            </div>
        </div>
    `;
    newsList.push(`<ul>`)
    for(let i = (store.currentPage -1) * 10; i < store.currentPage * 10; i++) {
        newsList.push(`  
            <li>
                <a href="#${newsFeed[i].id}"> 
                ${newsFeed[i].title} (${newsFeed[i].comments_count})       
                </a>
            </li>
        `);
    }

    template = template.replace('{{__news_feed__}}' , newsList.join(''));
    template = template.replace('{{__prev_page__}}' , store.currentPage > 1 ? store.currentPage -1 : 1);
    template = template.replace('{{__next_page__}}' , store.currentPage + 1);

    container.innerHTML = template
}



//newsdetail 
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



//router 
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