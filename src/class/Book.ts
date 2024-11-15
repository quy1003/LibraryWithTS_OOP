import { Author } from "./Author";
import { Category } from "./Category";


export class Book {
    private name: string;  
    private release: Date;  
    private author: Author[];  
    private category: Category[];  
    private image: string;  

    constructor(name: string, release: Date, author: Author[], category: Category[], image: string) {
        this.name = name;
        this.release = release;
        this.author = author;
        this.category = category;
        this.image = image;
    }

    // Setter methods
    public set setName(name: string) {
        this.name = name;
    }

    public set setRelease(release: Date) {
        this.release = release;
    }

    public set setAuthor(author: Author[]) {
        this.author = author;
    }

    public set setCategory(category: Category[]) {
        this.category = category;
    }

    public set setImage(image: string) {
        this.image = image;
    }

    // Getter methods
    public get getName(): string {
        return this.name;
    }

    public get getRelease(): Date {
        return this.release;
    }

    public get getAuthor(): Author[] {
        return this.author;
    }

    public get getCategory(): Category[] {
        return this.category;
    }

    public get getImage(): string {
        return this.image;
    }
}
