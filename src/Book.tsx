import React, { useState, useEffect } from "react";
import { Book } from "./class/Book";
import { Author } from "./class/Author";
import { Category } from "./class/Category";

const BookComponent = () => {
    const [bookName, setBookName] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [image, setImage] = useState('');
    const [booksList, setBooksList] = useState<Book[]>([]);
    const [authorsList, setAuthorsList] = useState<Author[]>([]);
    const [categoriesList, setCategoriesList] = useState<Category[]>([]);
    const [editingBook, setEditingBook] = useState<Book | null>(null);

    useEffect(() => {
        const storedBooks = sessionStorage.getItem('books');
        if (storedBooks) {
            const books = JSON.parse(storedBooks).map((book: any) =>
                new Book(
                    book.name,
                    new Date(book.release),
                    book.author.map((authorName: string) => {
                        const author = authorsList.find((auth) => auth.getName === authorName);
                        return author ? new Author(author.getId, author.getName, []) : null;
                    }).filter((auth:any) => auth !== null) as Author[],
                    book.category.map((category: any) => new Category(category.id, category.categoryName)),
                    book.image
                )
            );
            setBooksList(books);
        }
    
        // Lấy thông tin các tác giả và sách của họ
        const storedAuthorBooks = sessionStorage.getItem('authorBooks');
        if (storedAuthorBooks) {
            const authorBooks = JSON.parse(storedAuthorBooks);
            console.log(authorBooks);
        }
    
        // Lấy danh sách tác giả từ sessionStorage
        const storedAuthors = sessionStorage.getItem('authors');
        if (storedAuthors) {
            const authors = JSON.parse(storedAuthors).map((authorData: any) =>
                new Author(authorData.id, authorData.name, [])
            );
            setAuthorsList(authors);
        }
    
        // Lấy danh sách thể loại từ sessionStorage
        const storedCategories = sessionStorage.getItem('categories');
        if (storedCategories) {
            const categories = JSON.parse(storedCategories).map((cat: any) => new Category(cat.id, cat.categoryName));
            setCategoriesList(categories);
        }
    }, []);
    

    const submitBook = () => {
        if (!bookName.trim()) {
            alert("Please enter the book name.");
            return false;
        }
        if (!releaseDate.trim()) {
            alert("Please enter the release date.");
            return false;
        }
        if (selectedAuthors.length === 0) {
            alert("Please select at least one author.");
            return false;
        }
        if (selectedCategories.length === 0) {
            alert("Please select at least one category.");
            return false;
        }
        if (!image.trim()) {
            alert("Please enter the image URL.");
            return false;
        }
    
        const authors = selectedAuthors.map((authorId) => {
            const author = authorsList.find((auth) => auth.getId === authorId);
            return author ? new Author(author.getId, author.getName, []) : null;
        }).filter((auth) => auth !== null) as Author[];
    
        const categories = selectedCategories.map((categoryId) => {
            const category = categoriesList.find((cat) => cat.getId === categoryId);
            return category ? new Category(category.getId, category.getName) : null;
        }).filter((cat) => cat !== null) as Category[];
    
        const newBook = new Book(bookName, new Date(releaseDate), authors, categories, image);
        const updatedBooks = [...booksList, newBook];
        
        // Lưu sách vào sessionStorage
        sessionStorage.setItem('books', JSON.stringify(updatedBooks));
    
        // Cập nhật thông tin các tác giả và sách của họ
        const authorBooks = JSON.parse(sessionStorage.getItem('authorBooks') || '{}'); // Lấy thông tin các tác giả cũ, nếu có
    
        authors.forEach((author) => {
            if (authorBooks[author.getName]) {
                authorBooks[author.getName].push(bookName); // Thêm tên sách vào danh sách sách của tác giả
            } else {
                authorBooks[author.getName] = [bookName]; // Tạo mới danh sách sách cho tác giả
            }
        });
    
        // Lưu lại thông tin tác giả và sách của họ vào sessionStorage
        sessionStorage.setItem('authorBooks', JSON.stringify(authorBooks));
    
        setBooksList(updatedBooks);
        resetForm();
    };
    
    

    const editBook = (book: Book) => {
        setEditingBook(book);
        setBookName(book.getName);
        setReleaseDate(book.getRelease.toISOString().split('T')[0]);
        setSelectedAuthors(book.getAuthor.map((author) => author.getId));
        setSelectedCategories(book.getCategory.map((category) => category.getId));
        setImage(book.getImage);
    };

    const updateBook = () => {
        if (editingBook) {
            const updatedAuthors = selectedAuthors.map((authorId) => {
                const author = authorsList.find((auth) => auth.getId === authorId);
                return author ? new Author(author.getId, author.getName, []) : null;
            }).filter((auth) => auth !== null) as Author[];

            const updatedCategories = selectedCategories.map((categoryId) => {
                const category = categoriesList.find((cat) => cat.getId === categoryId);
                return category ? new Category(category.getId, category.getName) : null;
            }).filter((cat) => cat !== null) as Category[];

            const updatedBooks = booksList.map((book) =>
                book === editingBook
                    ? new Book(bookName, new Date(releaseDate), updatedAuthors, updatedCategories, image)
                    : book
            );
            sessionStorage.setItem('books', JSON.stringify(updatedBooks));
            setBooksList(updatedBooks);
            resetForm();
        }
    };

    const deleteBook = (bookToDelete: Book) => {
        const updatedBooks = booksList.filter((book) => book !== bookToDelete);
        sessionStorage.setItem('books', JSON.stringify(updatedBooks));
        setBooksList(updatedBooks);
    };

    const resetForm = () => {
        setBookName('');
        setReleaseDate('');
        setSelectedAuthors([]);
        setSelectedCategories([]);
        setImage('');
        setEditingBook(null);
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
        setSelectedCategories(selectedOptions);
    };

    const handleAuthorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
        setSelectedAuthors(selectedOptions);
    };

    return (
        <div>
            <h1 style={{ color: 'orange',marginTop:'-30px', position:'relative' }}>Book Management</h1>
            <a href="/categories/" style={{position:'absolute', right: '10px', top:'10px'}}>Go to categories page</a>
            <a href="/authors/" style={{position:'absolute', left: '10px', top:'10px'}}>Go to authors page</a>
            <p style={{marginTop:'-30px', textAlign:'justify', backgroundColor:'lightyellow'}}><i>*All of these fields must be included in the value properly. You have to create a category and an author before using this function, just access these page and the data will be loaded automatically. You can choose multiple values of authors or categories as long as you choose the one at least💡</i></p>
            <div>
                <input
                    type="text"
                    value={bookName}
                    onChange={(e) => setBookName(e.target.value)}
                    placeholder="Enter book name..."
                    style={{ padding: '10px', width: '50%' }}
                />
            </div>
            <div>
                <input
                    type="date"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    placeholder="Enter release date"
                    style={{ padding: '10px', width: '50%', marginTop: '10px' }}
                />
            </div>
            <div style={{ position: 'relative' }}>
                <select
                    multiple
                    value={selectedAuthors}
                    onChange={handleAuthorChange}
                    style={{ padding: '10px', width: '52%', marginTop: '10px', textAlign: 'center' }}
                >
                    {authorsList.map((author) => (
                        <option key={author.getId} value={author.getId}>
                            {author.getName}
                        </option>
                    ))}
                </select>
            </div>
            <div style={{ position: 'relative' }}>
                <select
                    multiple
                    value={selectedCategories}
                    onChange={handleCategoryChange}
                    style={{ padding: '10px', width: '52%', marginTop: '10px', textAlign: 'center' }}
                >
                    {categoriesList.map((category) => (
                        <option key={category.getId} value={category.getId}>
                            {category.getName}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Enter book image URL..."
                    style={{ padding: '10px', width: '50%', marginTop: '10px' }}
                />
            </div>
            <div>
                <button onClick={editingBook ? updateBook : submitBook} style={{ marginTop: '10px', backgroundColor: 'orange', color:'white' }}>
                    {editingBook ? 'Update Book' : 'Add New Book'}
                </button>
                {editingBook && (
                    <button onClick={resetForm} style={{ marginTop: '10px', backgroundColor: 'gray' }}>
                        Cancel
                    </button>
                )}
            </div>
            <h2 style={{color:'orange'}}>List of Books</h2>
            {booksList.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    {booksList.map((book) => (
                        <div key={book.getName} style={{ padding: '10px', backgroundColor: 'lightyellow', textAlign: 'center', border: '1px solid #ddd' }}>
                            <img src={book.getImage} alt={book.getName} style={{ width: '100%', height: '200px', objectFit: 'contain' }} />
                            <h3>{book.getName}</h3>
                            <p>Release: {book.getRelease.toLocaleDateString()}</p>
                            <p>Authors: {book.getAuthor.map((author) => author.getName).join(', ')}</p>
                            <p>Categories: {book.getCategory.map((category) => category.getName).join(', ')}</p>
                            <button onClick={() => editBook(book)} style={{ backgroundColor: 'blue', color: 'white' }}>Edit</button>
                            <button onClick={() => deleteBook(book)} style={{ backgroundColor: 'red', color: 'white', marginLeft: '10px' }}>Delete</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Nothing to show</p>
            )}
        </div>
    );
};

export default BookComponent;
