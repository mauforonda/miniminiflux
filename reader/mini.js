var container = document.querySelector('.entries')
var dateFormat = {hour:"numeric", minute:"numeric", day: "numeric", month: 'long'}

render_entry = (entry) => {

    date = new Date(entry['published_at'])
    dateString = date.toLocaleDateString("en-US", dateFormat)

    const link = document.createElement('a')
    link.classList = ['entry']
    link.href = entry.url
    link.target = '_blank'
    link.title = dateString
    
    const content = document.createElement('div')
    content.classList = ['content']

    const title = document.createElement('div')
    title.classList = ['title']
    title.textContent = entry.title
    content.appendChild(title)

    const meta = document.createElement('div')
    meta.classList = ['meta']
    const feed = document.createElement('span')
    feed.classList = ['feed']
    feed.textContent = entry.feed
    meta.appendChild(feed)
    if ('comments_url' in entry) {
	const comments = document.createElement('span')
	comments.classList = ['comments']
	comments_link = document.createElement('a')
	comments_link.href = entry.comments_url
	comments_link.target = '_blank'
	comments_link.textContent = 'comments'
	comments.appendChild(comments_link)
	meta.appendChild(comments)
    }
    content.appendChild(meta)

    const elements = ['title', 'feed'].map(field => {
    })

    link.appendChild(content)
    container.appendChild(link)
}

download_and_render = () => {
    url = "entries.json"    
    fetch(url).then((response) => {
	response.json().then((entries) => {
	    entries.forEach(e => render_entry(e))
	})
    })
}

download_and_render()
