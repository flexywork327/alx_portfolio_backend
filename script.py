#!/usr/bin/python3
import os


def main():

    #   check if the directory is a git repository
    if os.path.isdir(".git"):
        print(" ")
    else:
        print("This is not a git repository")
        # initialize the git repository
        os.system("git init")


#   Check if the remote repository URL is set
    if os.system("git remote get-url origin") == 0:
        repo_url = os.popen("git remote get-url origin").read()

    else:
        print("Remote repository URL is not set")
        # set the remote repository URL
        repo_url = input("Enter the remote repository URL: ")
        os.system("git remote add origin " + repo_url)
        os.system("git branch -M main")


#  Get the Current branch name
    current_branch_name = os.popen("git branch").read()
    current_branch_name = current_branch_name.split("*")[1]


#   Get commit message
    commit_message = input("Enter the commit message: ")


#  Add all files to staging area
    os.system("git add .")


#   Commit the changes
    os.system("git commit -m \"" + commit_message + "\"")


#   Push the changes to github url obtained from the remote repository
    os.system("git push " + repo_url + " " + current_branch_name)


if __name__ == "__main__":
    main()
