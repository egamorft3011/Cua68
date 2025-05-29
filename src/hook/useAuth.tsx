import { getMe } from "@/services/User.service";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res: any = await getMe();
        if (res.code === 200) {
          setUser(res.user);

          setLoading(false);
        } else {
          // router.replace("/");
        }
      } catch (error) {
        // router.replace("/");
      }
    };
    fetchUser();
  }, [router]);
  return { user, loading };
}
