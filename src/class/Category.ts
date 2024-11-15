export class Category{
    private id: string;
    private categoryName: string;

    constructor(id: string, categoryName: string){
        this.id = id;
        this.categoryName = categoryName;
    }

    get getId():string{
        return this.id
    }

    get getName(): string{
        return this.categoryName
    }

    set setName(categoryName: string){
        this.categoryName = categoryName
    }
}
