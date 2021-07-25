//html에서 container 태그를 가져옴
const container = document.getElementById('root');
//서버 통신을 위해서 XMLHttpRequest() 변수 ajax 담는다 
const ajax = new XMLHttpRequest();

//div 생성
const Content = document.createElement('div');

//ajax 통신 open , send , response
//ajx.open('method 방식' , 'api url' , 비동기통신 안한다는뜻입니다)
ajax.open('GET' , '	https://api.hnpwa.com/v0/news/1.json' , false)
ajax.send();

//JOSON 형태로 값을 받는다
const newsFeed = JSON.parse(ajax.response);
console.log(newsFeed)

//createElement 생성 
const ul = document.createElement('ul');


//hash event 생성
//hashchange 이벤트는 같은 페이지 안에서 해시(#)만 바뀌었을 때, 즉 페이지에서 id가 있는 요소로 이동하게 하기위해서 hash를 쓴다 
window.addEventListener('hashchange' , function(){
    const id = location.hash;
    console.log('hash 변경됨');

    //hash 값을 구하기위해서 replace 메소드를 속성을 쓴다.
    ajax.open('GET', 'https://api.hnpwa.com/v0/item/13831370.json', false);
    ajax.send();
    const newsContent = JSON.parse(ajax.response);

    const title = document.createElement('h1');

    title.innerHTML = newsContent.title;

    Content.appendChild(title);

})



//for문으로 먼저 10의 title값을 가져오기
for(let i = 0; i < 10; i++){
    const li = document.createElement('li');
    const a = document.createElement('a');
    

    a.href = `#${newsFeed[i].id}`;
    a.innerHTML = `${newsFeed[i].title} (${newsFeed[i].comments_count})`


    // a Element 생성 후 값들을 넣어주고 li appendChild 자식으로 넣어준다
    // ul태그안에 자식 li 넣는다 appenChild 자식을 넣기위한 메소드
    li.appendChild(a);
    ul.appendChild(li);

}

//container 넣음으로 결과 값이 잘나온다!
container.appendChild(ul);
container.appendChild(Content);