import { getNote } from "@/actions/actions";
import { AlertCircle } from "lucide-react";
import Notes from "@/components/Notes";
import { Metadata } from "next";

type Props = {
    params: Promise<{ id: string }>; // ✅ Đổi thành Promise
};

// 👉 Metadata động cho Facebook, Zalo, Messenger
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params; // ✅ Await params trước khi sử dụng
    const note = await getNote(id);

    if (!note || note.error) {
        return {
            title: "Không tìm thấy ghi chú | MoMoLo",
            description: "Ghi chú bạn tìm không tồn tại.",
        };
    }

    return {
        title: `${note.title || "Ghi chú"} | MoMoLo`,
        description: note.content?.slice(0, 150),
        openGraph: {
            title: `${note.title || "Ghi chú"} | MoMoLo`,
            description: note.content?.slice(0, 150),
            url: `https://momolo.io.vn/notes/${id}`, // ✅ Sử dụng id đã được await
            siteName: "MoMoLo",
            type: "article",
            images: [
                {
                    url:
                        note.thumbnail || "https://momolo.io.vn/og-default.png",
                },
            ],
        },
    };
}

export default async function NotesPage({ params }: Props) {
    const { id } = await params; // ✅ Await params trước khi sử dụng

    try {
        const data = await getNote(id);

        if (data.error) {
            return (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">
                        Không tìm thấy ghi chú
                    </h2>
                    <p className="text-gray-600">
                        Ghi chú bạn đang tìm kiếm có thể đã bị xóa hoặc không
                        tồn tại.
                    </p>
                </div>
            );
        }

        return <Notes content={data.content} />;
    } catch (error) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center">
                <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Có lỗi xảy ra</h2>
                <p className="text-gray-600">Vui lòng thử lại sau.</p>
            </div>
        );
    }
}
