export default function FileUpload({
    onChange,
}: {
    onChange: (file: File) => void;
}) {
    return (
        <input
            type="file"
            onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                    onChange(e.target.files[0]);
                }
            }}
        />
    );
}
