import { useState } from "react";
import { octokit } from "@/github";
import { REPO_OWNER, REPO_NAME, BRANCH } from "@/env";
import matter from "gray-matter";
import { Button } from "@/components/ui/button";

export function Editor({ file, onDone }: { file: any; onDone: () => void }) {
  const [value, setValue] = useState(file.content);

  const save = async () => {
    const newContent = matter.stringify(value, file.parsed);
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: file.path,
      message: `Update ${file.name}`,
      content: btoa(unescape(encodeURIComponent(newContent))),
      sha: file.sha,
      branch: BRANCH,
    });
    onDone();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Editing: {file.name}</h2>
      <textarea
        className="w-full min-h-[400px] border p-2 font-mono"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex gap-4">
        <Button onClick={save}>Save</Button>
        <Button variant="secondary" onClick={onDone}>Cancel</Button>
      </div>
    </div>
  );
}