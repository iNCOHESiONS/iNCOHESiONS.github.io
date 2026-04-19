export function isMobile() {
    return /Android|webOS|iPhone|iP[ao]d|BlackBerry|IEMobile|Opera Mini|Mobile|CriOS/i.test(
        navigator.userAgent,
    );
}
