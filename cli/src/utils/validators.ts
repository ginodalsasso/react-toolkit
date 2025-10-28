export function validateNotEmpty(input: string): boolean | string {
    if (!input || input.trim() === "") {
        return "This field cannot be empty";
    }
    return true;
}
