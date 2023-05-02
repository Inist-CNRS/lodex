export default function filterVersions(data, feed) {
    if (data && data.versions) {
        const { versions, ...dataWithoutVersions } = data;
        const lastVersion = versions[versions.length - 1];

        feed.send({
            ...dataWithoutVersions,
            ...lastVersion,
        });
        return;
    }

    feed.send(data);
}
