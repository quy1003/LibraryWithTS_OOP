import { Book } from "./Book";
import { User } from "./User";

export class Author extends User {
    private books: Book[];

    constructor(id: string, name: string, books: Book[]) {
        super(id, name);
        this.books = books;
    }

    public set setBooks(books: Book[]) {
        this.books = books;
    }

    public set setName(name: string) {
        this.name = name;
    }

    public set setId(id: string) {
        this.id = id;
    }

    public get getBooks(): Book[] {
        return this.books;
    }

    public get getName(): string {
        return this.name;
    }

    public get getId(): string {
        return this.id;
    }
}
