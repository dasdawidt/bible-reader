export function changeTheme(
    oldTheme: string,
    newTheme: string,
    linkElementId: string
) {
    const element = document.querySelector(`#${linkElementId}`);
    if (element instanceof HTMLLinkElement)
        element.href = element.href?.replace(oldTheme, newTheme);
}
