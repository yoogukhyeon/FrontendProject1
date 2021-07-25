//중복된 코드를 리팩토리 

//html에서 container 태그를 가져옴
const container = document.getElementById('root');
//서버 통신을 위해서 XMLHttpRequest() 변수 ajax 담는다 
const ajax = new XMLHttpRequest();

const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

//중복되는 AJAX 함수를 만들기 바뀌는 부분은 URL 밖에 없기 떄문에 인자로 URL 넣고 호출할떄마다 URL 바꿔준다
function getDate(URL){
    //ajax 통신 open , send , response
    //ajx.open('method 방식' , 'api url' , 비동기통신 안한다는뜻입니다)
    ajax.open('GET' , URL  , false)
    ajax.send();
    //JOSON 형태로 return 값을 받는다
    return JSON.parse(ajax.response);
 
};

//div 생성
const Content = document.createElement('div');

//createElement 생성 
const ul = document.createElement('ul');


function newsFeed(){
    const newsFeed = getDate(NEWS_URL)

    const newsList = [];

    newsList.push('<ul>')
    //for문으로 먼저 10의 title값을 가져오기
    //문자열로 html 만들기 되도록 DOM객체에 Element속성을 안쓰고 UI를 구성하는것이 효율적이고 좋음
    for(let i = 0; i < 10; i++){
        newsList.push(`
            <li>
                <a href='#${newsFeed[i].id}'>
                    ${newsFeed[i].title} (${newsFeed[i].comments_count})
                </a>
            </li>
        `);
    }
    
    newsList.push('</ul>')
    
    // join() 메서드는 배열의 모든 요소를 연결해 하나의 문자열로 만듭니다.
    container.innerHTML = newsList.join('')
}

function newsDetail(){
    //newsContent API url 보면 @id 부분에 @지우기 위해 substr 썻다
    const id = location.hash.substr(1);
    console.log('hash 변경됨');

    //hash 값을 구하기위해서 replace 메소드를 속성을 써거 첫번쨰 인자를 두번쨰 인자로 바꾼다.
    const newsContent = getDate(CONTENT_URL.replace('@id', id));

    container.innerHTML = `
        <h1>${newsContent.title}</h1>

        <div>
            <a href="#">목록으로</a>
        </div>
    `;
}

function router(){
    const routerPath = location.hash;

    if(routerPath === ""){
        newsFeed();
    }else{
        newsDetail();
    }
}

//hash event 생성
//hashchange 이벤트는 같은 페이지 안에서 해시(#)만 바뀌었을 때, 즉 페이지에서 id가 있는 요소로 이동하게 하기위해서 hash를 쓴다 
window.addEventListener('hashchange' , router);
router();


