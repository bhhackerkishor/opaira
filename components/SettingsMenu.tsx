"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { useUI } from "@/context/UIContext";

export default function SettingsMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const { settings, setSettings } = useUI();

  return (
    <div className="absolute top-20 right-4 z-50">
      <Button
        onClick={() => setShowMenu((s) => !s)}
        className="bg-yellow-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
      >
        <Settings size={20} />
      </Button>

      {showMenu && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 mt-2 w-64"
        >
          <Card className="p-4 bg-white shadow-xl border border-yellow-200 rounded-xl">
            <h3 className="font-semibold text-yellow-600 mb-2">Settings</h3>
            <div className="flex flex-col gap-2 text-sm">
              <label className="flex items-center justify-between">
                <span>Don&apos;t reconnect same user</span>
                <input
                  type="checkbox"
                  checked={settings.skipPreviousPartner}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      skipPreviousPartner: e.target.checked,
                    })
                  }
                />
              </label>

              <label className="flex items-center justify-between">
                <span>Sound effects</span>
                <input
                  type="checkbox"
                  checked={settings.soundEffects}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      soundEffects: e.target.checked,
                    })
                  }
                />
              </label>

              <label className="flex items-center justify-between">
                <span>Auto connect next user</span>
                <input
                  type="checkbox"
                  checked={settings.autoConnect}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      autoConnect: e.target.checked,
                    })
                  }
                />
              </label>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
