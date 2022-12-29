var container = document.querySelector('.feed')
var dateFormat = {hour:"numeric", minute:"numeric", day: "numeric", month: 'long'}
var openPost

render_post = (el, postID) => {
    const post = document.createElement('div')
    post.classList.add('post')
    fetch(`posts/${postID}`).then((response) => {
        response.text().then((postText) => {
            post.innerHTML = postText
        })
    })
    el.closest('.content').appendChild(post)
    el.scrollIntoView({block:'start', behavior: "smooth"})
    openPost = postID
}

linkHandler = (e) => {
    var postID  = e.target.closest('.content').dataset.post
    if (openPost == postID) {
        const reading = document.querySelector('.post')
        if (reading) {
            reading.remove()
        }
        openPost = ''
    } else {
        const reading = document.querySelector('.post')
        if (reading) {
            reading.remove()
        }
        render_post(e.target, postID)
    }
}

format_entry = (entry) => {

    date = new Date(entry['published_at'])
    dateString = date.toLocaleDateString("en-US", dateFormat)

    const link = document.createElement('a')
    link.classList = ['entry']
    // link.href = entry.url
    link.title = dateString
    link.addEventListener('click', linkHandler)
    
    const content = document.createElement('div')
    content.classList = ['content']
    content.dataset.post = entry.id

    const title = document.createElement('div')
    title.classList = ['title']
    title.textContent = entry.title
    content.appendChild(title)

    const meta = document.createElement('div')
    meta.classList = ['meta']
    const source = document.createElement('span')
    source.classList = ['source']
    source.dataset.post = entry.id
    source.textContent = entry.feed
    meta.appendChild(source)
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

    const original = document.createElement('a')
    original.classList.add('original')
    original.href = entry.url
    original.target = '_blank'

    link.appendChild(original)
    link.appendChild(content)
    return link
}

render_category = (cat) => {

    const category = document.createElement('div')
    category.classList.add('category')

    const category_header = document.createElement('div')
    category_header.classList.add('category_header')
    category_header.textContent = cat.name
    
    const category_entries = document.createElement('div')
    category_entries.classList.add('category_entries')
    cat.entries.forEach(e => {
        const entry = format_entry(e)
        category_entries.appendChild(entry)
    })

    category.appendChild(category_header)
    category.appendChild(category_entries)
    container.appendChild(category)
}

download_and_render = () => {
    url = "entries.json"    
    fetch(url).then((response) => {
	response.json().then((categories) => {
	    categories.forEach(cat => render_category(cat))
	})
    })
}

download_and_render()
