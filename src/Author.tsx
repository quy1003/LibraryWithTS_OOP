import { useState, useEffect } from 'react';
import { Author } from './class/Author';

const AuthorComponent = () => {
    const [authorId, setAuthorId] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [authorsList, setAuthorsList] = useState<Author[]>([]);
    const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
    const [authorBooks, setAuthorBooks] = useState<{ [key: string]: string[] }>({});

    useEffect(() => {
        const storedAuthors = sessionStorage.getItem('authors');
        if (storedAuthors) {
            const authors = JSON.parse(storedAuthors).map((authorData: any) =>
                new Author(authorData.id, authorData.name, [])
            );
            setAuthorsList(authors);
        } else {
            // Dữ liệu mặc định khi không có tác giả trong sessionStorage
            const defaultAuthors = [
                new Author('1', 'J.K. Rowling',[]),
                new Author('2', 'George Orwell',[]),
            ];

            sessionStorage.setItem('authors', JSON.stringify(defaultAuthors));

            setAuthorsList(defaultAuthors);
        }

        const storedAuthorBooks = sessionStorage.getItem('authorBooks');
        if (storedAuthorBooks) {
            setAuthorBooks(JSON.parse(storedAuthorBooks));
        }
    }, []);

    const saveAuthorsToSession = (authors: Author[]) => {
        const authorsData = authors.map((author) => ({
            id: author.getId,
            name: author.getName,
        }));
        sessionStorage.setItem('authors', JSON.stringify(authorsData));
    };

    const submitAuthor = () => {
        const newAuthor = new Author(authorId, authorName, []);
        const updatedAuthors = [...authorsList, newAuthor];
        saveAuthorsToSession(updatedAuthors);
        setAuthorsList(updatedAuthors);
        resetForm();
    };

    const updateAuthor = () => {
        if (editingAuthor) {
            const updatedAuthors = authorsList.map((author) =>
                author === editingAuthor
                    ? new Author(authorId, authorName, [])
                    : author
            );
            saveAuthorsToSession(updatedAuthors);
            setAuthorsList(updatedAuthors);
            resetForm();
        }
    };

    const editAuthor = (author: Author) => {
        setEditingAuthor(author);
        setAuthorId(author.getId);
        setAuthorName(author.getName);
    };

    const deleteAuthor = (authorToDelete: Author) => {
        const updatedAuthors = authorsList.filter((author) => author !== authorToDelete);
        saveAuthorsToSession(updatedAuthors);
        setAuthorsList(updatedAuthors);
    };

    const resetForm = () => {
        setAuthorId('');
        setAuthorName('');
        setEditingAuthor(null);
    };

    return (
        <div>
            <h1 style={{color:'orange', marginTop:'-30px', position:'relative'}}>Author Management</h1>
            <a href="/books/" style={{position:'absolute', left: '10px', top:'10px'}}>Go to books page</a>
            <span>
                <p style={{marginTop:'-20px', textAlign:'center', backgroundColor:'lightyellow'}}><i>*All of these fields must be included the value properly💡</i></p>
            </span>
            <div>
                <input
                    type="text"
                    value={authorId}
                    onChange={(e) => setAuthorId(e.target.value)}
                    placeholder="Enter author ID"
                    style={{ padding: '10px', width: '40%' }}
                />
            </div>
            <div>
                <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Enter author name"
                    style={{ padding: '10px', width: '40%', marginTop: '10px' }}
                />
            </div>
            <div>
                <button onClick={editingAuthor ? updateAuthor : submitAuthor} style={{ marginTop: '10px', backgroundColor: 'orange', color:'white' }}>
                    {editingAuthor ? 'Update Author' : 'Add New Author'}
                </button>
                {editingAuthor && (
                    <button onClick={resetForm} style={{ marginTop: '10px', backgroundColor: 'gray' }}>
                        Cancel
                    </button>
                )}
            </div>

            <h2 style={{color:'orange'}}>List of Authors</h2>
            {authorsList.length > 0 ? (
                <ul style={{ listStyleType: 'none' }}>
                    {authorsList.map((author) => (
                        <li key={author.getId} style={{ padding: '5px', backgroundColor: 'lightyellow', marginTop: '5px' }}>
                            <p><strong>{author.getName}</strong></p>

                            {/* Hiển thị danh sách sách của tác giả */}
                            <div>
                                <strong>Books:</strong>
                                <div style={{listStyleType:'none'}}>
                                    {(authorBooks[author.getName] || []).length > 0 ? (
                                        authorBooks[author.getName].map((bookName, index) => (
                                            <span key={index}>{bookName} {' '}</span>
                                        ))
                                    ) : (
                                        <p>No books found</p>
                                    )}
                                </div>
                            </div>

                            <button onClick={() => editAuthor(author)} style={{ backgroundColor: 'blue', color: 'white' }}>Edit</button>
                            <button onClick={() => deleteAuthor(author)} style={{ backgroundColor: 'red', color: 'white', marginLeft: '10px' }}>Delete</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nothing to show</p>
            )}
        </div>
    );
};

export default AuthorComponent;
