document.getElementById("form").addEventListener("submit", (event) => {
    event.preventDefault(); 
    const inputContent = document.getElementById("search").value;
    const APIURL = `https://api.github.com/users/${inputContent}`;
    setData(APIURL);
});
let getData = async(url) => {
    try {
        let api_connection = await fetch(url); 
        let json_response = await api_connection.json();
        console.log("Contection success");
        return json_response;
    } catch (error){
        console.error(`Error fetching data ${error}`);
    }
}
let setData = async(url) =>{
    try{
        let response = await getData(url);
        const card=document.createElement('div');
        card.classList.add('card');
        if(response.message=="Not Found"){
            const h2 = document.createElement('h2');
            h2.textContent = "No profile with this username";
            card.appendChild(h2);
        }else{
            const avatar = document.createElement('img');
            avatar.classList.add('avatar');
            avatar.src = response.avatar_url;
            card.appendChild(avatar);

            const user_info= document.createElement('div');
            user_info.classList.add('user-info');

            const h2 = document.createElement('h2');
            h2.textContent = (response.name || response.login);
            user_info.appendChild(h2);

            const bio = document.createTextNode(response.bio || "There is no bio");
            user_info.appendChild(bio);


            const datas = document.createElement('ul');
            datas.appendChild(list(response.followers, 'followers'));
            datas.appendChild(list(response.following, 'following'));
            datas.appendChild(list(response.public_repos, 'repos'));
            user_info.appendChild(datas);

            let repos_data = await getData(`${response.repos_url}?sort=created&direction=desc&per_page=5`);
            console.log(repos_data);
            const repos = document.createElement('ul');
            repos_data.forEach(repo => {
                let list= document.createElement('li');
                list.classList.add('repo');

                const link = document.createElement('a');
                link.textContent = repo.name;
                link.href = repo.html_url; 
                link.target = "_blank";
                link.rel = "noopener noreferrer";

                list.appendChild(link);                
                repos.appendChild(list);
            });
            user_info.appendChild(repos);
            card.appendChild(user_info);
        }

        document.getElementById('main').innerHTML = "";
        document.getElementById('main').appendChild(card);
    }catch(error){
        console.error(`Error rendering data ${error}`);
    }
}
let list = (data, label) => {
    const listElement = document.createElement('li');
    const strong= document.createElement('strong');
    strong.textContent = data;
    listElement.appendChild(strong);
    const listLabel= document.createTextNode(` ${label}`);
    listElement.appendChild(listLabel);
    return listElement;
}