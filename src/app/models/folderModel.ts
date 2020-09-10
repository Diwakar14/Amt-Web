export class Folder{
    folder: string;
    user: string;
    documents: []
}
interface FolderType{
    id:''
    folder: '',
    canDelete: boolean,
    documents: any[]
}
export class LocalFolder{
    folders: FolderType[]
}