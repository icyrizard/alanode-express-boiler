export type FilterEntryType = {
    topic?: string;
    operator?: string;
    parent?: string;
    nested?: boolean;
    mode?: string | undefined;
    type?: "int" | "string" | "boolean",
    include?: boolean;
    relatedModel?: string;
    field?: string;
    fn?: Function | undefined,
    key?: string;
    inclFn?: Function | undefined,
}

export type FilterMapType = {
    [key: string]: FilterEntryType;
}

export type SortEntryType = {
    topic?: string;
    type?: "int" | "string" | "boolean";
    relatedModel?: string;
}


export type SortByMapType = {
    [key: string]: SortEntryType;
}
