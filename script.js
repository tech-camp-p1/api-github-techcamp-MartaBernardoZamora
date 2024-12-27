document.getElementById("form").addEventListener("submit", (event) => {
    event.preventDefault(); 
    const inputContent = document.getElementById("search").value;
    const APIURL = `https://api.github.com/users/${inputContent}`;
    setData(APIURL);
});
let getData = async(url) => {
    try {
        let api_connection = await fetch(url);
        return await api_connection.json();
    } catch (error){
        console.error(`Error fetching data ${error}`);
    }
}
let create = (tag, classId=null, text=null) =>{
    if(!tag) return null;
    const element=document.createElement(tag);
    classId && element.classList.add(classId);
    text && (element.textContent = text);
    return element;
}
let listed = (data, label) => {
    const listElement = document.createElement('li');
    const strong= create('strong', null, data);
    listElement.appendChild(strong);
    const listLabel= document.createTextNode(` ${label}`);
    listElement.appendChild(listLabel);
    return listElement;
}
let setData = async(url) =>{
    try{
        let response = await getData(url);
        let repos_data = await getData(`${url}/repos?sort=created&direction=desc&per_page=5`);

        const card=create('div', 'card');
        
        if(response.message=="Not Found"){
            const h2 = create('h2', null, "No profile with this username");
            card.appendChild(h2);
        }else{
            const avatar = create('img', 'avatar');
            avatar.src = response.avatar_url;
            card.appendChild(avatar);

            const userInfo= create('div', 'user-info');

            const h2 = create('h2', null, response.name || response.login);
            userInfo.appendChild(h2);

            const bio = document.createTextNode(response.bio || "There is no bio");
            userInfo.appendChild(bio);

            const datas = document.createElement('ul');
            datas.appendChild(listed(response.followers, 'followers'));
            datas.appendChild(listed(response.following, 'following'));
            datas.appendChild(listed(response.public_repos, 'repos'));
            userInfo.appendChild(datas);

            const repos = document.createElement('ul');

            repos_data.forEach(repo => {
                let list= create('li', 'repo');

                const link = create('a', null, repo.name);
                link.href = repo.html_url; 
                link.target = "_blank";
                link.rel = "noopener noreferrer";

                list.appendChild(link);                
                repos.appendChild(list);
            });
            userInfo.appendChild(repos);
            card.appendChild(userInfo);
        }
        document.getElementById('main').innerHTML = "";
        document.getElementById('main').appendChild(card);
    }catch(error){
        console.error(`Error rendering data ${error}`);
    }
}