#include <iostream>
#include <filesystem>

int main(int argc, char *argv[])
{
    std::string a = (std::string)(argv[0]);
    const std::string cd = a.substr(0, a.find_last_of("/"));

    try
    {
        system("clear"); // MacOS
    }
    catch (...)
    {
        try
        {
            system("cls"); // Windows & Linux
        }
        catch (...)
        {
        }
    }

    std::filesystem::current_path(cd);
    system("node writeImports.js");
}